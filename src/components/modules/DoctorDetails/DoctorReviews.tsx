"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getReviews } from "@/src/services/patient/reviews.services";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  patient: {
    name: string;
    profilePhoto?: string;
  };
}

interface DoctorReviewsProps {
  doctorId: string;
}

export default function DoctorReviews({ doctorId }: DoctorReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setIsLoading(true);
        const res = await getReviews(`doctorId=${doctorId}`);
        if (res.success && res.data) {
          setReviews(res.data);
        } else {
          toast.error(res.message || "Failed to load reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    }

    if (doctorId) {
      fetchReviews();
    }
  }, [doctorId]);

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const starIdx = Math.max(1, Math.min(5, Math.round(r.rating))) - 1;
    ratingCounts[starIdx]++;
  });

  return (
    <Card className="border-t-4 border-t-purple-500">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-purple-900">
          <MessageSquare className="h-5 w-5 text-purple-600" /> Patient Reviews ({totalReviews})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-muted-foreground">Loading reviews...</span>
          </div>
        ) : totalReviews === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-gray-100 rounded-lg">
            <p className="text-lg">No reviews yet</p>
            <p className="text-sm mt-1">Be the first patient to share your consultation experience!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center bg-purple-50/50 p-6 rounded-xl border border-purple-100 text-center">
              <span className="text-5xl font-extrabold text-purple-900">{averageRating}</span>
              <div className="flex items-center gap-1 my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(parseFloat(averageRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Average Rating</span>
            </div>

            <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars - 1];
                const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-sm">
                    <span className="w-12 font-medium text-muted-foreground">{stars} Stars</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="md:col-span-3 border-t pt-6 space-y-4">
              <h4 className="font-semibold text-lg text-purple-900 mb-2">Patient Feedback</h4>
              <div className="divide-y divide-gray-100 space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{review.patient?.name || "Anonymous Patient"}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }) : "N/A"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
