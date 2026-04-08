from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.seed import seed
from app.routes import auth, tvs, midias, playlist

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed()
    yield
app = FastAPI(lifespan=lifespan)


@app.get("/api/")
async def init():
    return {"message": "Hello World"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/midias", StaticFiles(directory="/app/midias"), name="midias")

app.include_router(auth.router)
app.include_router(tvs.router)
app.include_router(midias.router)
app.include_router(playlist.router)