-- AlterTable
ALTER TABLE "TodoItem" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "scheduleFor" SET DATA TYPE TEXT;
