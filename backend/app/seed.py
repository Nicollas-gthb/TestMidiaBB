from app.core.database import SessionLocal
from app.models.tv import TV
from app.models.user import Usuario
from app.core.security import criptografar

def seed():
    session = SessionLocal()

    try:
        # Verifica se já existe dado no banco para não duplicar
        if session.query(TV).first():
            print("Seed já executado, pulando...")
            return

        tvs = [
            TV(numero=1, nome="tvRec"),
            TV(numero=2, nome="tvRef"),
            TV(numero=3, nome="tvHall"),
        ]

        admin = Usuario(
            nome="Admin",
            email="admin@email.com",
            senha=criptografar("adminsenha"),
            perfil="admin"
        )

        session.add_all(tvs)
        session.add(admin)
        session.commit()
        print("Seed executado com sucesso!")

    except Exception as e:
        session.rollback()
        print(f"Erro no seed: {e}")
    finally:
        session.close()