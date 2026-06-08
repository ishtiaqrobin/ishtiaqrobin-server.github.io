-- AmarShikkhok Database Schema
-- This SQL represents the database structure for the AmarShikkhok tutoring platform
-- Based on the Prisma schema from workflow.md

-- 1. CREATE ENUMS

CREATE TYPE "Role" AS ENUM ('STUDENT', 'TUTOR', 'ADMIN');
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELLED');

-- 2. CREATE USERS TABLE

CREATE TABLE "users" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "profileImage" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 3. CREATE TUTOR PROFILES TABLE

CREATE TABLE "tutor_profiles" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "bio" TEXT,
    "expertise" TEXT[],
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "experience" INTEGER NOT NULL,
    "education" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tutor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. CREATE CATEGORIES TABLE

CREATE TABLE "categories" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT UNIQUE NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 5. CREATE AVAILABILITIES TABLE

CREATE TABLE "availabilities" (
    "id" TEXT PRIMARY KEY,
    "tutorId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "availabilities_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. CREATE BOOKINGS TABLE

CREATE TABLE "bookings" (
    "id" TEXT PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "notes" TEXT,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "bookings_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. CREATE REVIEWS TABLE

CREATE TABLE "reviews" (
    "id" TEXT PRIMARY KEY,
    "bookingId" TEXT NOT NULL UNIQUE,
    "studentId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reviews_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8. CREATE MANY-TO-MANY RELATION TABLE

CREATE TABLE "_CategoryToTutorProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryToTutorProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToTutorProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "tutor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 9. CREATE INDEXES FOR PERFORMANCE

-- Unique indexes for many-to-many relation
CREATE UNIQUE INDEX "_CategoryToTutorProfile_AB_unique" ON "_CategoryToTutorProfile"("A", "B");
CREATE INDEX "_CategoryToTutorProfile_B_index" ON "_CategoryToTutorProfile"("B");

-- Performance indexes for common queries
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "tutor_profiles_userId_key" ON "tutor_profiles"("userId");
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");

-- Foreign key indexes
CREATE INDEX "tutor_profiles_userId_idx" ON "tutor_profiles"("userId");
CREATE INDEX "availabilities_tutorId_idx" ON "availabilities"("tutorId");
CREATE INDEX "bookings_studentId_idx" ON "bookings"("studentId");
CREATE INDEX "bookings_tutorId_idx" ON "bookings"("tutorId");
CREATE INDEX "reviews_bookingId_idx" ON "reviews"("bookingId");
CREATE INDEX "reviews_studentId_idx" ON "reviews"("studentId");
CREATE INDEX "reviews_tutorId_idx" ON "reviews"("tutorId");

-- 1. ID fields use TEXT (String in Prisma) with @default(uuid())
-- 2. All foreign keys have ON DELETE CASCADE and ON UPDATE CASCADE
-- 3. Enums: Role (STUDENT, TUTOR, ADMIN) and BookingStatus (CONFIRMED, COMPLETED, CANCELLED)
-- 4. Many-to-Many: TutorProfile <-> Category via _CategoryToTutorProfile
-- 5. One-to-One: User -> TutorProfile (userId is unique)
-- 6. One-to-Many: User -> Bookings, TutorProfile -> Bookings, Booking -> Review
-- 7. dayOfWeek: 0=Sunday, 1=Monday, ..., 6=Saturday
-- 8. Time format: "HH:MM" (e.g., "09:00", "17:00")
-- 9. Rating: Integer 1-5