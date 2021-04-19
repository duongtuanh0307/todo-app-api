/*
  Warnings:

  - Added the required column `priority` to the `TodoItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `TodoItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('WORK', 'PRIVATE');

-- AlterTable
ALTER TABLE "TodoItem" ADD COLUMN     "priority" "Priority" NOT NULL,
ADD COLUMN     "category" "Category" NOT NULL;
