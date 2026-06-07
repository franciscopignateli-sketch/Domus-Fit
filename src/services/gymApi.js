// Centralização da constante BASE_URL facilita a migração para produção sem necessidade de alterar múltiplos ficheiros
const BASE_URL = 'http://localhost/domus_backend';

export const fetchGymClasses = async (userId = null) => {
    try {
        const url = userId 
            ? `${BASE_URL}/get_classes.php?user_id=${userId}` 
            : `${BASE_URL}/get_classes.php`;
            
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Falha de rede em fetchGymClasses:", error);
        return { success: false, message: "Falha na ligação." };
    }
};

export const bookClass = async (userId, classId) => {
    try {
        const response = await fetch(`${BASE_URL}/book_class.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, class_id: classId })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro ao processar reserva." };
    }
};

export const cancelClass = async (userId, classId) => {
    try {
        const response = await fetch(`${BASE_URL}/cancel_class.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, class_id: classId })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro ao processar cancelamento." };
    }
};

export const fetchUserBookings = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/get_user_bookings.php?user_id=${userId}`);
        return await response.json();
    } catch (error) {
        return { success: false, bookings: [] };
    }
};

export const subscribePlan = async (userId, planName) => {
    try {
        const response = await fetch(`${BASE_URL}/subscribe.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, plan_name: planName }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Falha na comunicação com o servidor." };
    }
};

export const fetchUserProfile = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/get_profile.php?user_id=${userId}`);
        return await response.json();
    } catch (error) {
        return { success: false, message: "Falha ao carregar perfil." };
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/update_profile.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Falha ao atualizar dados." };
    }
};

// Omissão intencional dos headers 'Content-Type' para permitir que o browser configure automaticamente os boundaries do FormData
export const uploadUserPhoto = async (userId, file) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('photo', file);

    try {
        const response = await fetch(`${BASE_URL}/upload_photo.php`, {
            method: 'POST',
            body: formData, 
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro na transmissão do ficheiro." };
    }
};

export const createGymClass = async (classData) => {
    try {
        const response = await fetch(`${BASE_URL}/create_class.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(classData)
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro de ligação ao servidor." };
    }
};

export const fetchTrainers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/get_trainers.php`);
        return await response.json();
    } catch (error) {
        return { success: false, trainers: [] };
    }
};

export const createTrainer = async (trainerData) => {
    try {
        const response = await fetch(`${BASE_URL}/create_trainer.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainerData)
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: "Erro de ligação ao servidor." };
    }
};

export const fetchTrainerAgenda = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/get_trainer_agenda.php?user_id=${userId}`);
        return await response.json();
    } catch (error) {
        return { success: false, classes: [] };
    }
};