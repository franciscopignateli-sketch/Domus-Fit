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

// Função para comprar/subscrever um plano
export const subscribePlan = async (userId, planName) => {
    try {
        const response = await fetch(`${BASE_URL}/subscribe.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, plan_name: planName }),
        });
        return await response.json();
    } catch (error) {
        console.error("Erro ao subscrever:", error);
        return { success: false, message: "Falha na ligação ao servidor." };
    }
};

// Vai buscar os dados completos do perfil
export const fetchUserProfile = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/get_profile.php?user_id=${userId}`);
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro de ligação." };
    }
};

// Atualiza os dados do perfil
export const updateUserProfile = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/update_profile.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro de ligação." };
    }
};

// Adiciona isto no fim do gymApi.js
export const uploadUserPhoto = async (userId, file) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('photo', file);

    try {
        const response = await fetch(`${BASE_URL}/upload_photo.php`, {
            method: 'POST',
            body: formData, // Quando usamos FormData, não metemos os headers de JSON!
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro ao fazer upload." };
    }
};

// Criar uma nova aula (Apenas para Admins)
export const createGymClass = async (classData) => {
    try {
        const response = await fetch(`${BASE_URL}/create_class.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(classData)
        });
        return await response.json();
    } catch (error) {
        console.error("Erro ao criar aula:", error);
        return { success: false, message: "Erro de ligação ao servidor." };
    }
};

// Vai buscar todos os treinadores disponíveis para preencher o <select> do formulário
export const fetchTrainers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/get_trainers.php`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao ir buscar treinadores:", error);
        return { success: false, trainers: [] };
    }
};
// Criar uma nova conta de Treinador (Apenas para Admins)
export const createTrainer = async (trainerData) => {
    try {
        const response = await fetch(`${BASE_URL}/create_trainer.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainerData)
        });
        return await response.json();
    } catch (error) {
        console.error("Erro ao criar treinador:", error);
        return { success: false, message: "Erro de ligação ao servidor." };
    }
};

// Vai buscar as aulas específicas de um treinador
export const fetchTrainerAgenda = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/get_trainer_agenda.php?user_id=${userId}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao ir buscar agenda do treinador:", error);
        return { success: false, classes: [] };
    }
};