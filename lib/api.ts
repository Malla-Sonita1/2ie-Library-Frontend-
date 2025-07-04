const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Utility to normalize headers to Record<string, string>
function normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return { ...headers };
}

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// Ajoute la gestion du refresh token
export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${API_URL}/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error("Impossible de rafraîchir le token");
  return await res.json();
}

// Modifie apiFetch pour gérer le refresh automatique
async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = false
) {
  let token = getToken();
  const baseHeaders = normalizeHeaders(options.headers);
  const headers: Record<string, string> = {
    ...baseHeaders,
    ...(requireAuth && token ? { Authorization: `Bearer ${token}` } : {}),
  };
  let res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if ((res.status === 401 || res.status === 403) && requireAuth) {
    // Essayer de rafraîchir le token si un refreshToken existe
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    if (refreshToken) {
      try {
        const data = await refreshAccessToken(refreshToken);
        if (data.token) {
          localStorage.setItem("token", data.token);
          token = data.token;
          // Rejoue la requête initiale avec le nouveau token
          headers["Authorization"] = `Bearer ${token}`;
          res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        } else {
          // Échec du refresh, suppression des tokens
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    } else {
      localStorage.removeItem("token");
    }
  }
  return res;
}

export async function login(email: string, password: string) {
  const res = await apiFetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function register(data: { name: string; email: string; password: string; studentId?: string; department?: string; role?: string }) {
  const res = await apiFetch("/students/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function getMe(token?: string) {
  // Logging
  console.log("Calling /me with token:", token);
  const res = await apiFetch("/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }, true);
  if (!res.ok) throw new Error("Not authenticated");
  const data = await res.json();
  // Logging
  console.log("getMe response:", data);
  return data.user;
}

export async function getBooks() {
  const res = await apiFetch("/books", {}, true);
  return await res.json();
}

export async function addBook(book: any) {
  const res = await apiFetch("/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  }, true);
  return await res.json();
}

export async function updateBook(id: number, book: any) {
  const res = await apiFetch(`/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  }, true);
  return await res.json();
}

export async function deleteBook(id: number) {
  const res = await apiFetch(`/books/${id}`, {
    method: "DELETE" }, true);
  return await res.json();
}

export async function reserveBook(bookId: number, dueDate: string) {
  const res = await apiFetch("/loans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, dueDate }),
  }, true);
  return await res.json();
}

// Réservations
export async function getReservations() {
  const res = await apiFetch("/reservations/mes-reservations", {}, true);
  if (!res.ok) throw new Error("Erreur API");
  return await res.json();
}

export async function cancelReservation(id: number) {
  const res = await apiFetch(`/reservations/${id}`, {
    method: "DELETE"
  }, true);
  return await res.json();
}

export async function fulfillReservation(reservationId: number) {
  const res = await apiFetch(`/loans/fulfill/${reservationId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, true);
  return await res.json();
}

export async function getComments() {
  const res = await apiFetch("/comments", {}, true);
  return await res.json();
}

export async function getCommentsByBook(bookId: number) {
  const res = await apiFetch(`/comments/book/${bookId}`, {}, true);
  return await res.json();
}

export async function getStats() {
  const res = await apiFetch("/stats/borrowed-books", {}, true);
  if (!res.ok) throw new Error("Erreur stats");
  return await res.json();
}

export async function sendLateNotification(userId: number) {
  const res = await apiFetch(`/notifications/late`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  }, true);
  return await res.json();
}

export async function returnBook(reservationId: number) {
  const res = await apiFetch(`/loans/${reservationId}/return`, {
    method: "POST"
  }, true);
  return await res.json();
}

export async function getNotifications() {
  const res = await apiFetch("/notifications", {}, true);
  if (!res.ok) throw new Error("Erreur lors de la récupération des notifications");
  return await res.json();
}

export async function updateProfile(data: { name?: string; email?: string; password?: string }) {
  const res = await fetch("/api/auth/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Récupérer les réservations de l'utilisateur connecté avec position dans la file d'attente
export async function getUserReservationsWithQueue() {
  const res = await apiFetch("/reservations/mes-reservations", {}, true);
  if (!res.ok) throw new Error("Erreur API");
  return await res.json();
}

// Récupérer les réservations de l'utilisateur connecté (avec file d'attente)
export async function getUserReservations() {
  const res = await apiFetch("/reservations/mes-reservations", {}, true);
  if (!res.ok) throw new Error("Erreur API");
  return await res.json();
}

// Récupérer l'historique complet des réservations de l'utilisateur connecté
export async function getUserReservationsHistory() {
  const res = await apiFetch("/reservations/mes-reservations", {}, true);
  if (!res.ok) throw new Error("Erreur API");
  return await res.json();
}

// Recherche avancée de livres avec filtres dynamiques
export async function searchBooks(filters: { title?: string; author?: string; category?: string; tag?: string }) {
  const params = new URLSearchParams();
  if (filters.title) params.append('title', filters.title);
  if (filters.author) params.append('author', filters.author);
  if (filters.category) params.append('category', filters.category);
  if (filters.tag) params.append('tag', filters.tag);
  const res = await fetch(`/api/books/search?${params.toString()}`);
  if (!res.ok) throw new Error('Erreur lors de la recherche avancée');
  return await res.json();
}

export async function markNotificationAsRead(id: number) {
  const res = await apiFetch(`/notifications/${id}/read`, {
    method: "PATCH"
  }, true);
  if (!res.ok) throw new Error("Erreur lors du marquage de la notification");
  return await res.json();
}

export async function addComment(bookId: number, rating: number, comment: string) {
  const res = await apiFetch(`/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, rating, comment }),
  }, true);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Erreur lors de l'ajout du commentaire: " + errorText);
  }
  return await res.json();
}

// Récupérer les emprunts de l'utilisateur connecté
export async function getUserLoans() {
  const res = await apiFetch("/loans/mes-emprunts", {}, true);
  if (!res.ok) throw new Error("Erreur API");
  return await res.json();
}

// Récupérer l'historique complet des emprunts de l'utilisateur connecté
export async function getUserHistory() {
  const res = await apiFetch("/loans/history", {}, true);
  if (!res.ok) throw new Error("Erreur API");
  return await res.json();
}

export async function getUsers() {
  const res = await apiFetch("/users", {}, true);
  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
  return await res.json();
}

export async function updateUser(id: number, data: { name: string; email: string; role: string; is_active: boolean }) {
  const res = await apiFetch(`/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }, true);
  return res;
}

export async function deleteUser(id: number) {
  const res = await apiFetch(`/users/${id}`, {
    method: "DELETE"
  }, true);
  return res;
}

export async function addUser(data: { name: string; email: string; password: string; role: string }) {
  const res = await apiFetch(`/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }, true);
  return res;
}

// Récupérer tous les emprunts (admin)
export async function getAllLoans() {
  const res = await apiFetch("/loans/admin", {}, true);
  if (!res.ok) throw new Error("Erreur lors du chargement des emprunts");
  return await res.json();
}

// Récupérer les statistiques des emprunts (admin)
export async function getLoanStats() {
  const res = await apiFetch("/loans/stats", {}, true);
  if (!res.ok) throw new Error("Erreur lors du chargement des statistiques");
  return await res.json();
}

// Retourner un livre (admin ou étudiant)
export async function returnLoan(loanId: number, isAdmin = false) {
  const endpoint = isAdmin ? `/loans/${loanId}/admin-return` : `/loans/${loanId}/return`;
  const res = await apiFetch(endpoint, { method: "POST" }, true);
  if (!res.ok) throw new Error("Erreur lors du retour du livre");
  return await res.json();
}
