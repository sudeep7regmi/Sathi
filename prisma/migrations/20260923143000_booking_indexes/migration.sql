-- Supporting indexes for booking ownership, status filtering, and overlap checks.
CREATE INDEX `Booking_groundId_date_startTime_endTime_idx`
  ON `Booking`(`groundId`, `date`, `startTime`, `endTime`);

CREATE INDEX `Booking_userId_createdAt_idx`
  ON `Booking`(`userId`, `createdAt`);

CREATE INDEX `Booking_status_idx`
  ON `Booking`(`status`);
