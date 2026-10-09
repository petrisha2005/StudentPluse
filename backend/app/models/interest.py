from sqlalchemy import String, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Interest(Base):
    __tablename__ = "interests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=True)

    user_interests = relationship("UserInterest", back_populates="interest", cascade="all, delete-orphan")

class UserInterest(Base):
    __tablename__ = "user_interests"
    __table_args__ = (UniqueConstraint('user_id', 'interest_id', name='uq_user_interest'),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    interest_id: Mapped[int] = mapped_column(Integer, ForeignKey("interests.id", ondelete="CASCADE"), nullable=False, index=True)

    user = relationship("User", back_populates="interests")
    interest = relationship("Interest", back_populates="user_interests")
