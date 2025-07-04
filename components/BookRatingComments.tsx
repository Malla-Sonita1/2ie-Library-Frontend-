import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getCommentsByBook, addComment } from "@/lib/api";

interface BookRatingCommentsProps {
  bookId: string;
}

export function BookRatingComments({ bookId }: BookRatingCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getCommentsByBook(Number(bookId)).then(setComments);
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addComment(Number(bookId), rating, comment);
    setComment("");
    setRating(0);
    setSubmitted(true);
    const updated = await getCommentsByBook(Number(bookId));
    setComments(updated);
    setLoading(false);
    setTimeout(() => setSubmitted(false), 2000);
  };

  // Affichage résumé (2 avis max)
  const previewComments = comments.slice(0, 2);

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Noter ce livre</h3>
      {submitted ? (
        <div className="text-green-600">Merci pour votre avis !</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className={
                  n <= rating
                    ? "text-yellow-400 text-2xl"
                    : "text-gray-300 text-2xl"
                }
                aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            className="input w-full border rounded px-3 py-2"
            placeholder="Votre commentaire"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      )}
      {/* Affichage résumé des avis */}
      <div className="mt-4 space-y-3">
        {comments.length === 0 && (
          <div className="text-gray-400 italic">Aucun avis pour ce livre.</div>
        )}
        {previewComments.map((c, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm flex flex-col gap-1"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-2ie-blue">
                {c.user_name || c.user_id}
              </span>
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={
                      n <= c.rating
                        ? "text-yellow-400 text-lg"
                        : "text-gray-300 text-lg"
                    }
                  >
                    ★
                  </span>
                ))}
              </span>
              <span className="ml-2 text-xs text-gray-400">
                {c.rating}/5
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {c.comment}
            </div>
          </div>
        ))}
        {comments.length > 2 && (
          <button
            className="text-2ie-blue hover:underline text-xs mt-1"
            onClick={() => setShowAll(true)}
            type="button"
          >
            Voir tous les avis ({comments.length})
          </button>
        )}
      </div>
      {/* Modale tous les avis */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-2ie-blue text-xl"
              onClick={() => setShowAll(false)}
              aria-label="Fermer"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">Tous les avis</h3>
            <div className="space-y-3">
              {comments.map((c, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-2ie-blue">
                      {c.user_name || c.user_id}
                    </span>
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={
                            n <= c.rating
                              ? "text-yellow-400 text-lg"
                              : "text-gray-300 text-lg"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                      {c.rating}/5
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    {c.comment}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
