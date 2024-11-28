from fastapi import APIRouter

router = APIRouter(tags=["System"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": "0.0.1"}
