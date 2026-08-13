"""Restaure une sauvegarde produite par backup_mongodb.py.

Par sécurité, refuse d'écraser la base configurée (MONGODB_DB_NAME) sauf
si --force est passé explicitement. Permet de restaurer vers une base
différente (ex. pour tester une restauration sans toucher aux données
réelles) via --target-db.

Usage : python scripts/restore_mongodb.py <dossier_de_sauvegarde> --target-db hba_connect_restore_test
"""

import argparse
import gzip
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from bson import json_util
from pymongo import MongoClient

from app.core.config import get_settings


def restore(backup_dir: Path, target_db: str, force: bool) -> dict[str, int]:
    settings = get_settings()

    if target_db == settings.mongodb_db_name and not force:
        raise SystemExit(
            f"Restauration vers la base active '{target_db}' refusée sans --force "
            "(cela écraserait les données courantes)."
        )

    client = MongoClient(settings.mongodb_uri)
    db = client[target_db]

    counts: dict[str, int] = {}
    for file_path in sorted(backup_dir.glob("*.jsonl.gz")):
        collection_name = file_path.stem.removesuffix(".jsonl")
        documents = []
        with gzip.open(file_path, "rt", encoding="utf-8") as handle:
            for line in handle:
                line = line.strip()
                if line:
                    documents.append(json_util.loads(line))

        if documents:
            db[collection_name].delete_many({})
            db[collection_name].insert_many(documents)

        counts[collection_name] = len(documents)
        print(f"  {collection_name} : {len(documents)} document(s) restauré(s)")

    client.close()
    print(f"Restauration terminée dans la base '{target_db}'.")
    return counts


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("backup_dir", type=Path)
    parser.add_argument("--target-db", required=True)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    restore(args.backup_dir, args.target_db, args.force)
