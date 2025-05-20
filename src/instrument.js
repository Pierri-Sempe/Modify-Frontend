import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://3f54dcdd972b00fa71c1615987aab539@o4509324720275456.ingest.us.sentry.io/4509352809988096",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

