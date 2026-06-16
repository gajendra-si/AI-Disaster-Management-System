from sqlalchemy import Column, Integer, String, Float
from database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    description = Column(String)
    severity = Column(String)