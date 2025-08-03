import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const bookingReminderTemplate = (
  startTime: Date,
  serviceTitle: string,
  providerName: string
) => {
  const formattedTime = dayjs(startTime)
    .utc()
    .format("HH:mm [UTC] – MMMM D, YYYY");

  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <p>Hi,</p>

      <p>This is a friendly reminder that your booking for 
      <strong>${serviceTitle}</strong> with 
      <strong>${providerName}</strong> is scheduled in <strong>30 minutes</strong>.</p>

      <p><strong>Start Time:</strong> ${formattedTime}</p>

      <p>We look forward to seeing you!</p>

      <p style="margin-top: 20px;">Best regards,<br/>Booking Team</p>
    </div>
  `;
};
