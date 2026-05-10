// src/services/gymApi.js

const BASE_URL = 'http://localhost/domus_backend';

// Vai buscar as aulas
export const fetchGymClasses = async () => {
    try {
        const response = await fetch(`${BASE_URL}/get_classes.php`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao ligar ao servidor:", error);
        return { success: false, message: "Falha na ligação ao servidor." };
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