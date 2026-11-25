# Builder

FROM alpine:latest AS backend-builder

RUN apk add --no-cache rustup musl-dev build-base

WORKDIR /app/backend

RUN rustup-init -y --default-toolchain nightly --profile minimal

COPY crates ./crates
COPY Cargo.toml ./

ENV PATH="/root/.cargo/bin:${PATH}"

RUN RUSTFLAGS="-Z threads=$(nproc)" cargo build --release

# Runner

FROM alpine:latest AS runtime

WORKDIR /app

RUN tree

COPY --from=backend-builder /app/backend/target/release/matcha-webapi ./matcha-webapi
COPY docker-entrypoint.sh ./docker-entrypoint.sh

EXPOSE 3000

RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]