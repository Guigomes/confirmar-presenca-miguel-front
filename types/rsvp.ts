export type Rsvp = {
  id: string;
  guest_name: string;
  attending: boolean;
  companions_count: number;
  message: string | null;
  created_at: string;
};

export type RsvpFormValues = {
  guest_name: string;
  attending: boolean;
  companions_count: number;
  message?: string;
};
