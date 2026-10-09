import pytest
from alembic.config import Config
from alembic import command
import os

def test_alembic_migration_head_execution():
    alembic_cfg = Config(os.path.join(os.path.dirname(__file__), "..", "alembic.ini"))
    alembic_cfg.set_main_option("script_location", os.path.join(os.path.dirname(__file__), "..", "alembic"))
    alembic_cfg.set_main_option("sqlalchemy.url", "sqlite:///./test_migration_temp.db")
    
    # Test upgrading to head on a clean database
    command.upgrade(alembic_cfg, "head")
    
    # Cleanup temp db
    if os.path.exists("./test_migration_temp.db"):
        os.remove("./test_migration_temp.db")
