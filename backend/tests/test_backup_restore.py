from pymongo import MongoClient

from app.core.config import get_settings
from scripts.backup_mongodb import backup
from scripts.restore_mongodb import restore


async def test_backup_then_restore_round_trips_documents(db, seeded_formation, tmp_path):
    settings = get_settings()
    backup_dir = backup(tmp_path)

    target_db = f"{settings.mongodb_db_name}_restore_test"
    client = MongoClient(settings.mongodb_uri)
    try:
        restore(backup_dir, target_db=target_db, force=False)

        restored_formations = list(client[target_db]["formations"].find({}))
        original_formations = await db.formations.find({}).to_list(length=None)

        assert len(restored_formations) == len(original_formations)
        assert {str(doc["_id"]) for doc in restored_formations} == {
            str(doc["_id"]) for doc in original_formations
        }
    finally:
        client.drop_database(target_db)
        client.close()


def test_restore_refuses_to_overwrite_active_database_without_force(tmp_path):
    settings = get_settings()
    backup_dir = backup(tmp_path)

    try:
        restore(backup_dir, target_db=settings.mongodb_db_name, force=False)
        assert False, "devrait lever SystemExit sans --force"
    except SystemExit:
        pass
