from fastapi import APIRouter

from src.controllers.system_controller import router as system_router

router = APIRouter()

router.include_router(system_router)
