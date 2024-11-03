// database/scheduleDB.js
import * as SQLite from "expo-sqlite";

// Função para abrir o banco de dados de forma assíncrona usando openDatabaseAsync
const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("schedules.db");
    return db;
  } catch (error) {
    throw error;
  }
};

// Função para criar as tabelas se não existirem
export const createTable = async () => {
  const db = await openDatabase();
  await db.execAsync([
    {
      sql: `
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS schedules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          favorite BLOB NOT NULL
        );

        CREATE TABLE IF NOT EXISTS servicesProvider (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS relatesServicesProvider (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idService INTEGER NOT NULL,
          idProvider INTEGER NOT NULL,
          affinity INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS relatesServiceSchedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idService INTEGER NOT NULL,
          idSchedules INTEGER NOT NULL,
          idProvider INTEGER NOT NULL
        );
      `,
      args: []
    }
  ]);
};

// Função para adicionar um serviço
export const addService = async (service) => {
  const db = await openDatabase();
  const result = await db.execAsync(
    "INSERT INTO services (name, description, favorite) VALUES (?, ?, ?)",
    [service.name, service.description, service.favorite]
  );
  return result;
};

// Função para adicionar um agendamento
export const addSchedule = async (schedule) => {
  const db = await openDatabase();
  const result = await db.execAsync(
    "INSERT INTO schedules (name, phone, date, time) VALUES (?, ?, ?, ?)",
    [schedule.name, schedule.phone, schedule.date, schedule.time]
  );
  return result;
};

export const addRelatesServicesProvider = async (relatesServicesProvider) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "INSERT INTO relatesServicesProvider (idProvider,idService,affinity) VALUES (?,?,?)",
      [
        relatesServicesProvider.idProvider,
        relatesServicesProvider.idService,
        relatesServicesProvider.affinity,
      ]
    );

    return result;
  } catch (error) {
    throw error;
  }
};


export const addRelatesSchedulesServices = async (relatesServicesProvider) => {
  console.log('aqui')
  console.log(relatesServicesProvider)
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
  
      "INSERT INTO relatesServiceSchedule (idSchedules,idService,idProvider) VALUES (?,?,?)",
      [
        relatesServicesProvider.idSchedules,
        relatesServicesProvider.idService,
        relatesServicesProvider.idProvider,
      ]
    );

    return result;
  } catch (error) {
    throw error;
  }
};


export const getRelatesServicesProvider = async () => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM relatesServicesProvider"
    );

    return result;
  } catch (error) {
    throw error;
  }
};

export const addServicesProvider = async (serviceProvider) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "INSERT INTO servicesProvider (name) VALUES (?)",
      [serviceProvider.name]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getLastServicesProvider = async () => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getFirstAsync(
      "SELECT * FROM servicesProvider ORDER BY id DESC"
    );

    return result;
  } catch (error) {
    throw error;
  }
};

// Função para obter agendamentos em uma data específica
export const getSchedules = async (date) => {
  const db = await openDatabase();
  const result = await db.getAllAsync(
    "SELECT * FROM schedules WHERE date = ? ORDER BY time ASC",
    [date]
  );
  return result;
};

// Função para obter todos os serviços, ordenados por favoritos e nome
export const getServices = async () => {
  const db = await openDatabase();
  const result = await db.getAllAsync(
    "SELECT * FROM services ORDER BY favorite DESC, name ASC"
  );
  return result;
};

export const getServicesProvider = async () => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM servicesProvider ORDER BY name ASC"
    );

    return result;
  } catch (error) {
    throw error;
  }
};

export const getListServicesProvider = async (providerId) => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT services.id, services.name, relatesServicesProvider.affinity " +
      "FROM services INNER JOIN relatesServicesProvider " +
      "ON services.id = relatesServicesProvider.idService " +
      "WHERE relatesServicesProvider.idProvider = ? ",
      [providerId]  // Buscando serviços relacionados ao idProvider
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getListProvider = async (providerId) => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT servicesProvider.id, servicesProvider.name, relatesServicesProvider.affinity " +
      "FROM servicesProvider INNER JOIN relatesServicesProvider " +
      "ON servicesProvider.id = relatesServicesProvider.idProvider " +
      "WHERE relatesServicesProvider.idService = ? ",
      [providerId]  // Buscando serviços relacionados ao idProvider
    );
    return result;
  } catch (error) {
    throw error;
  }
};


export const getTeste = async () => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM relatesServicesProvider"
    );

    return result;
  } catch (error) {
    throw error;
  }
};

// Função para deletar um agendamento
export const deleteSchedule = async (id) => {
  const db = await openDatabase();
  const result = await db.execAsync(
    "DELETE FROM schedules WHERE id = ?",
    [id]
  );
  return result;
};

export const deleteService = async (id) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync("DELETE FROM services WHERE id = ?", [id]);

    return result;
  } catch (error) {
    throw error;
  }
};

// Função para atualizar um agendamento existente
export const updateSchedule = async (schedule) => {
  const db = await openDatabase();
  const result = await db.execAsync(
    "UPDATE schedules SET name = ?, phone = ?, date = ?, time = ? WHERE id = ?",
    [schedule.name, schedule.phone, schedule.date, schedule.time, schedule.id]
  );
  return result;
};

// Função para atualizar um serviço
export const updateService = async (service) => {
  const db = await openDatabase();
  const result = await db.execAsync(
    "UPDATE services SET name = ?, description = ?, favorite = ? WHERE id = ?",
    [service.name, service.description, service.favorite, service.id]
  );
  return result;
};

export const updateServiceProvider = async (serviceProvider) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "UPDATE servicesProvider SET name = ? WHERE id = ?",  // Corrigido: vírgula adicionada corretamente
      [serviceProvider.name, serviceProvider.id]  // Removido parâmetro duplicado
    );
    await deleteRelatesServiceProvider(serviceProvider);  // Deleta os serviços relacionados antigos
    return result;
  } catch (error) {
    throw error;
  }
};


export const deleteRelatesServiceProvider = async (serviceProvider) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "DELETE FROM relatesServicesProvider WHERE idProvider = ?",
      [serviceProvider.id]
    );
    return result;
  } catch (error) {

    
    throw error;
  }
};


export const deleteServiceProvider = async (serviceProvider) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "DELETE FROM servicesProvider WHERE id = ?",
      [serviceProvider.id]
    );
    console.log(serviceProvider.id)
console.log('deu bom')
    return result;
  } catch (error) {

    console.log('deu ruim')
    console.log(error)
    throw error;
  }
};



