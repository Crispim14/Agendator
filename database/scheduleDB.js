// database/scheduleDB.js
import * as SQLite from 'expo-sqlite';

// Função para abrir o banco de dados
const openDatabase = async () => {
    try {
        const db = await SQLite.openDatabaseAsync('schedules.db');
        return db;
    } catch (error) {
        
        throw error;
    }
};

// Função para criar a tabela se não existir
export const createTable = async () => {
    try {
        const db = await openDatabase();
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS schedules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                service TEXT NOT NULL,
                professional TEXT
            );
        `);
     
    } catch (error) {
       
        throw error;
    }
};

// Função para adicionar um agendamento
export const addSchedule = async (schedule) => {
    try {
        const db = await openDatabase();
        const result = await db.runAsync(
            'INSERT INTO schedules (name, phone, date, time, service, professional) VALUES (?, ?, ?, ?, ?, ?)',
            [schedule.name, schedule.phone, schedule.date, schedule.time, schedule.service, schedule.professional]
        );
        return result;
    } catch (error) {
       
        throw error;
    }
};

// Função para buscar os agendamentos para uma data específica
export const getSchedules = async (date) => {
    try {
        createTable();
        const db = await openDatabase();
        const result = await db.getAllAsync('SELECT * FROM schedules WHERE date = ? ORDER BY time ASC', [date]);
      
        return result;
    } catch (error) {

        throw error;
    }
};

// Função para excluir um agendamento
export const deleteSchedule = async (id) => {
    try {
        const db = await openDatabase();
        const result = await db.runAsync('DELETE FROM schedules WHERE id = ?', [id]);
        
        return result;
    } catch (error) {
       
        throw error;
    }
};

// Função para atualizar um agendamento existente
export const updateSchedule = async (schedule) => {
    try {
        const db = await openDatabase();
        const result = await db.runAsync(
            'UPDATE schedules SET name = ?, phone = ?, date = ?, time = ?, service = ?, professional = ? WHERE id = ?',
            [schedule.name, schedule.phone, schedule.date, schedule.time, schedule.service, schedule.professional, schedule.id]
        );
       
        return result;
    } catch (error) {
       
        throw error;
    }
};

// Função para limpar todos os agendamentos
export const clearAllSchedules = async () => {
    try {
        const db = await openDatabase();
        const result = await db.execAsync('DELETE FROM schedules');
       
        return result;
    } catch (error) {
        
        throw error;
    }
};
