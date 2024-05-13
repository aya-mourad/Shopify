import { Feedback } from "./Feedback";
import { Products } from "./products";
import { rating } from "./rating";

export interface ProductWithFeedbackRating extends Products {
    feedback: Feedback[]; 
    rating: rating[]; 
    productId: string
  }