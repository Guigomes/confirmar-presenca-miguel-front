export type Rsvp = {
  id: string;
  guest_name: string;
  companions_count: number;
  message: string | null;
  created_at: string;
};

export type RsvpFormValues = {
  guest_name: string;
  companions_count: number;
  message?: string;
};
