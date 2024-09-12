-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT concat('usr_', replace((gen_random_uuid())::text, '-'::text, ''::text)),
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "avatar" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
