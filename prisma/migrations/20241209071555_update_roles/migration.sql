/*
  Warnings:

  - The values [MEMBER] on the enum `MemberRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "MemberRole" ADD VALUE 'MODERATOR';
ALTER TYPE "MemberRole"DROP VALUE 'MEMBER';
