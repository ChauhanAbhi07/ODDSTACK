export type Review = {
  id: string;
  quote: string;
  name: string;
  context: string;
  sourceUrl?: string;
  approved: boolean;
};

// Add real customer feedback only after permission to publish has been confirmed.
// The homepage section and navigation link appear when an approved review exists.
export const reviews: Review[] = [];
export const publishedReviews = reviews.filter((review) => review.approved);
