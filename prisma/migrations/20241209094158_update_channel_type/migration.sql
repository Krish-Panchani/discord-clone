/*
  Warnings:

  - The values [VOICE] on the enum `ChannelType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "ChannelType" ADD VALUE 'VIDEO';
ALTER TYPE "ChannelType"DROP VALUE 'VOICE';
