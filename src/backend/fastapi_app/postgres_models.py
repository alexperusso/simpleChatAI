from __future__ import annotations

from pgvector.sqlalchemy import Vector
from sqlalchemy import Index
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


# Definindo os modelos de dados - baseado no ada002 da openAI ou nomic do ollama
class Base(DeclarativeBase):
    pass


class Oraculo(Base):
    __tablename__ = "oraculo"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    categoria: Mapped[str] = mapped_column()
    nome: Mapped[str] = mapped_column()
    texto: Mapped[str] = mapped_column()
    # Diferentes modelos de Embeddings:
    embedding_ada002: Mapped[Vector] = mapped_column(Vector(1536), nullable=True)  # ada-002
    embedding_nomic: Mapped[Vector] = mapped_column(Vector(768), nullable=True)  # nomic-embed-text

    def to_dict(self, include_embedding: bool = False):
        model_dict = {column.name: getattr(self, column.name) for column in self.__table__.columns}
        if include_embedding:
            model_dict["embedding_ada002"] = model_dict.get("embedding_ada002", [])
            model_dict["embedding_nomic"] = model_dict.get("embedding_nomic", [])
        else:
            del model_dict["embedding_ada002"]
            del model_dict["embedding_nomic"]
        return model_dict

    def to_str_for_rag(self):
        return f"Categoria:{self.categoria} Nome:{self.nome} Texto:{self.texto}"

    def to_str_for_embedding(self):
        return f"Categoria:{self.categoria} Nome:{self.nome} Texto:{self.texto}"


# Definindo indice HNSW index para suportar busca de vetor por similaridade
# Use metodo de acesso vector_ip_ops (inner product) pois os embeddings sao normalizados

table_name = Oraculo.__tablename__

index_ada002 = Index(
    f"hnsw_index_for_innerproduct_{table_name}_embedding_ada002",
    Oraculo.embedding_ada002,
    postgresql_using="hnsw",
    postgresql_with={"m": 16, "ef_construction": 64},
    postgresql_ops={"embedding_ada002": "vector_ip_ops"},
)

index_nomic = Index(
    f"hnsw_index_for_innerproduct_{table_name}_embedding_nomic",
    Oraculo.embedding_nomic,
    postgresql_using="hnsw",
    postgresql_with={"m": 16, "ef_construction": 64},
    postgresql_ops={"embedding_nomic": "vector_ip_ops"},
)
