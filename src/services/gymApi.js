// src/services/gymApi.js

const BASE_URL = 'http://localhost/domus_backend';

// Vai buscar as aulas
export const fetchGymClasses = async (userId = null) => {
    try {
        // Se tivermos um userId, juntamos ao URL
        const url = userId 
            ? `${BASE_URL}/get_classes.php?user_id=${userId}` 
            : `${BASE_URL}/get_classes.php`;
            
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Erro ao ligar ao servidor:", error);
        return { success: false, message: "Falha na ligação." };
    }
};

// Faz a reserva
export const bookClass = async (userId, classId) => {
    try {
        const response = await fetch(`${BASE_URL}/book_class.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, class_id: classId })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro ao reservar." };
    }
};

// Cancela a reserva
export const cancelClass = async (userId, classId) => {
    try {
        const response = await fetch(`${BASE_URL}/cancel_class.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, class_id: classId })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro ao cancelar." };
    }
};

// Vai buscar as reservas de um utilizador específico
export const fetchUserBookings = async (userId) => {
    try {
        // Como é um GET, passamos o user_id no próprio URL
        const response = await fetch(`${BASE_URL}/get_user_bookings.php?user_id=${userId}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao procurar reservas:", error);
        return { success: false, bookings: [] };
    }
};