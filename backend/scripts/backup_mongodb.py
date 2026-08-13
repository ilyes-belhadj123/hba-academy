"""Sauvegarde toutes les collections de la base MongoDB configurée.

Écrit un fichier JSON Lines compressé (.jsonl.gz) par collection dans
backend/backups/<horodatage>/. Chaque ligne est un document encodé avec
bson.json_util (préserve ObjectId, datetime, etc. pour une restauration fidèle).

Usage : python scripts/backup_mongodb.py [--out-dir backups]
"""

import argparse
import gzip
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from bson import json_util
from pymongo import MongoClient

from app.core.config import get_settings


def backup(out_dir: Path) -> Path:
    settings = get_settings()
    client = MongoClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup_dir = out_dir / f"{settings.mongodb_db_name}_{timestamp}"
    backup_dir.mkdir(parents=True, exist_ok=True)

    collection_names = [name for name in db.list_collection_names() if not name.startswith("system.")]

    for name in collection_names:
        file_path = backup_dir / f"{name}.jsonl.gz"
        count = 0
        with gzip.open(file_path, "wt", encoding="utf-8") as handle:
            for document in db[name].find({}):
                handle.write(json_util.dumps(document))
                handle.write("\n")
                count += 1
        print(f"  {name} : {count} document(s) -> {file_path.name}")

    client.close()
    print(f"Sauvegarde terminée : {backup_dir}")
    return backup_dir


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out-dir", default="backups")
    args = parser.parse_args()
    backup(Path(args.out_dir))
