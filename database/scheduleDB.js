// database/scheduleDB.js
import * as SQLite from "expo-sqlite";

// Função para abrir o banco de dados
const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("schedules.db");
    return db;
  } catch (error) {
    throw error;
  }
}; 

// // Função para criar a tabela se não existir
// export const dropTable = async () => {
//   try {
//     const db = await openDatabase();
//     await db.execAsync(`
//             PRAGMA journal_mode = WAL;


// DROP TABLE IF EXISTS schedules;
// DROP TABLE IF  EXISTS relatesServicesProvider; 
//               DROP TABLE IF  EXISTS servicesProvider; 
//             DROP TABLE IF  EXISTS services;

//         `);
//   } catch (error) {
//     throw error;
//   }
// };

// Função para criar a tabela se não existir


//criar funcao de drop  ou delete aqui
// DELETE FROM schedules;

// DELETE FROM  services;

// DELETE FROM  servicesProvider;

// DELETE FROM relatesServicesProvider;

// DELETE FROM relatesServiceSchedule;


// DROP TABLE IF  EXISTS schedules;


// DROP TABLE IF  EXISTS services;

// DROP TABLE IF  EXISTS servicesProvider;

// DROP TABLE IF  EXISTS relatesServicesProvider;

// DROP TABLE IF  EXISTS relatesServiceSchedule;




export const dropTable = async () => {
  try {
    const db = await openDatabase();
    await db.execAsync(`
   DROP TABLE IF  EXISTS schedules;
   DROP TABLE IF  EXISTS services;
   DROP TABLE IF  EXISTS servicesProvider;
   DROP TABLE IF  EXISTS relatesServicesProvider;
   DROP TABLE IF  EXISTS relatesServiceSchedule;

        `);
  } catch (error) {
    throw error;
  }
};




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
              atendiment BIT DEFAULT 0
          );
            
          CREATE TABLE IF NOT EXISTS services (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              description TEXT NOT NULL,
              favorite BLOB NOT NULL,
              ramo INTEGER DEFAULT 0
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
          
           CREATE TABLE IF NOT EXISTS relatesServiceSchedule(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              idService INTEGER NOT NULL,
              idSchedules INTEGER NOT NULL,
              idProvider INTEGER NOT NULL
         
          );

CREATE TABLE  IF NOT EXISTS settings( 
first_access BIT, 
theme TEXT,
standard_message TEXT

 ); 
        `);
  } catch (error) {
    throw error;
  }
};

export const addService = async (service) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "INSERT INTO services (name, description,favorite) VALUES (?, ?, ?)",
      [service.name, service.description,service.favorite,]
    );
   
    
    return result;
  } catch (error) {

    throw error;
  }
};



export const addRamoAtividade = async (ramo) => {
  try {
    const db = await openDatabase();

    let  query = `` ;

if(ramo==1){
  query = `
  -- babearia
INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Corte de cabelo masculino', 'Corte de cabelo estilo clássico ou moderno, conforme preferência do cliente.', 0, 1);

INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Barba e bigode', 'Retoque de barba e bigode, com acabamento preciso e hidratação para a pele.', 0, 1);

INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Combo Corte + Barba', 'Corte de cabelo e barba no mesmo atendimento, com desconto exclusivo.', 0, 1);

INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Tratamento capilar', 'Hidratação e fortalecimento do cabelo masculino.', 0, 1);
`
}else if(ramo==3){
  query = ` 
  INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Delivery', 'Serviço de entrega de refeições no local escolhido pelo cliente.', 0, 3);

INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Menu vegetariano', 'Opções de pratos 100% vegetarianos, preparados com ingredientes frescos.', 0, 3);

INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Menu executivo', 'Opções de pratos rápidos e balanceados, ideais para o horário de almoço.', 0, 3);
	
INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Comida para eventos', 'Serviço de catering para eventos como festas e reuniões corporativas.', 0, 3);
  `
}else if(ramo==4){
query= ` 
--Mecânico
INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Troca de óleo', 'Troca de óleo e filtro, garantindo o bom funcionamento do motor do veículo.', 0, 4);

INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Alinhamento e balanceamento', 'Serviço para garantir que os pneus estejam corretamente alinhados e equilibrados.', 0, 4);

INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Revisão de suspensão', 'Verificação e manutenção da suspensão do veículo para evitar problemas de direção.', 0, 4);

INSERT INTO services (name, description, favorite, ramo) 
VALUES ('Diagnóstico eletrônico', 'Verificação dos sistemas eletrônicos do carro através de equipamentos especializados.', 0, 4);
`
}

    const result = await db.runAsync(query);
   
    
    return result;
  } catch (error) {

    throw error;
  }
};

// Função para adicionar um agendamento
export const addSchedule = async (schedule) => {
  try {

    console.log(`schedule`)
    console.log(schedule)
    

    const db = await openDatabase();
    const result = await db.runAsync(
      "INSERT INTO schedules (name, phone, date, time,atendiment ) VALUES (?, ?, ?, ?,?)",
      [
        schedule.name,
        schedule.phone,
        schedule.date,
        schedule.time,
        schedule.atendiment
      ]
    );
    return result;
  } catch (error) {
    throw error;
  }
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
    console.log('insert')
console.log(relatesServicesProvider)
    return result;
  } catch (error) {
    throw error;
  }
};


export const addRelatesSchedulesServices = async (relatesServicesProvider) => {

  try {
    const db = await openDatabase();
    const result = await db.runAsync(
  
      ` INSERT INTO relatesServiceSchedule (idSchedules,idService,idProvider) VALUES (?,?,?)` ,
      [
        relatesServicesProvider.idSchedules,
        relatesServicesProvider.idService,
        relatesServicesProvider.idProvider,
      ]
    );

    console.log("relacionando servico")
    console.log(relatesServicesProvider)
    return result;
  } catch (error) {
    throw error;
  }
};



export const deleteRelatesSchedulesServices = async (relatesServicesProvider) => {

  try {
    const db = await openDatabase();
    const result = await db.runAsync(
  
      ` DELETE FROM relatesServiceSchedule WHERE idSchedules = ? ` ,
      [
        relatesServicesProvider.idSchedules
      ]
    );

    console.log("relacionando servico")
    console.log(relatesServicesProvider)
    return result;
  } catch (error) {
    throw error;
  }
};



export const sla = async () => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM  relatesServiceSchedule"

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

export const getSchedules = async (date) => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM schedules WHERE date = ? ORDER BY time ASC",
      [date]
    );

    return result;
  } catch (error) {
    throw error;
  }
};



export const getDataSchedules = async (date) => {
  try {

    createTable(); // Presumo que essa função cria as tabelas, se necessário
    const db = await openDatabase(); // Abre o banco de dados (presumo que openDatabase seja uma função que você tem)

    // Consulta SQL com junção das tabelas corretamente formatada
    const result = await db.getAllAsync(
      `
      SELECT  schedules.id , schedules.name, schedules.date, schedules.time,schedules.phone, services.description
      FROM schedules
      INNER JOIN relatesServiceSchedule
        ON relatesServiceSchedule.idSchedules = schedules.id
      INNER JOIN services
      ON relatesServiceSchedule.idService = services.id
      WHERE schedules.date = ? 
      ORDER BY schedules.time ASC 
      `,
      [date] // O valor da data será passado aqui para o marcador "?"
    );



    return result;
  } catch (error) {

    throw error; // Relança o erro, caso precise ser tratado em outro lugar
  }
};


export const getServices = async () => {
  try {
    createTable(); // Cria a tabela se não existir
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM services ORDER BY favorite DESC, name ASC"
    );


    return result;
  } catch (error) {
    throw error;
  
  }
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

export const deleteSchedule = async (id) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync("DELETE FROM schedules WHERE id = ?", [
      id,
    ]);

    return result;
  } catch (error) {
    throw error;
  }
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
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "UPDATE schedules SET name = ?, phone = ?, date = ?, time = ?  WHERE id = ?",
      [
        schedule.name,
        schedule.phone,
        schedule.date,
        schedule.id,
      ]
    );

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateService = async (service) => {
  try {

    const db = await openDatabase();
    const result = await db.runAsync(
      "UPDATE services SET name = ?, description = ?, favorite = ? WHERE id = ?",
      [service.name, service.description, service.favorite, service.id]
    );

    return result;
  } catch (error) {
    throw error;
  }
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

    return result;
  } catch (error) {

   
    throw error;
  }
};

//relatorios

export const getsAllShedules = async () => {
  try {



    
    createTable(); // Presumo que essa função cria as tabelas, se necessário
    const db = await openDatabase(); // Abre o banco de dados (presumo que openDatabase seja uma função que você tem)

    // Consulta SQL com junção das tabelas corretamente formatada
    const result = await db.getAllAsync(
      `
      SELECT   name, phone
      FROM schedules ORDER BY name ASC 
      ` // O valor da data será passado aqui para o marcador "?"
    );



    return result;
  } catch (error) {

    throw error; // Relança o erro, caso precise ser tratado em outro lugar
  }
};




export const getSchedulesMonth = async (date,name) => {
  const ano = date.getFullYear();  // Obtém o ano
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');  


  const dataFormatada = `${ano}-${mes}`;

  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      `SELECT  name, phone FROM schedules
      WHERE strftime('%Y-%m', date) = ?
      AND   (  name like ? OR ? = '' ) 
      ORDER BY name ASC`,
      [dataFormatada,`%${name}%`,`%${name}%`]
    );

    return result;
  } catch (error) {
    throw error;
  }
};


export const getSchedules1= async (periodo,name) => {


  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      `SELECT  name, phone  FROM schedules
      WHERE  strftime('%Y-%m-%d',date) = strftime('%Y-%m-%d',DATE(CURRENT_TIMESTAMP, '-${periodo} days'))  
      AND  (  name like ? OR ? = '' )  
      ORDER BY name ASC`,
      [`%${name}%`,`%${name}%`]
     
    );


    return result;
  } catch (error) {
    throw error;
  }
};


export const getSchedulesYear= async (data,name) => {


 // const formattedDate = data.split('T')[0]
 const formattedDate  = data.toISOString().split('T')[0]
 
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      `SELECT  name, phone  FROM schedules
      WHERE  strftime('%Y',date) = strftime('%Y',?)  
      AND  (  name like ? OR ? = '' )  
      ORDER BY name ASC`,
      [formattedDate,`%${name}%`,`%${name}%`]
     
    );

    return result;
  } catch (error) {
    throw error;
  }
};




export const getSchedulesRange= async (data,data2,name) => {


  // const formattedDate = data.split('T')[0]
  const formattedDate1  = data.toISOString().split('T')[0]
  const formattedDate2  = data2.toISOString().split('T')[0]
  
   try {
     createTable();
     const db = await openDatabase();
     const result = await db.getAllAsync(
       `SELECT  name, phone  FROM schedules
       WHERE   date BETWEEN ? AND ?
       AND  (  name like ? OR name = '' )  
       ORDER BY name ASC`,
       [formattedDate1,formattedDate2, `%${name}%`]
      
     );
 
     return result; 
   } catch (error) {
     throw error;
   }
 };


 export const getAllSchedules = async (date,name) => {
  const formattedDate  = data.toISOString().split('T')[0]

  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getAllAsync(
      `SELECT * FROM schedules WHERE date = ?  AND  (  name like ? OR name = '' )  
       ORDER BY name ASC`,
      [ formattedDate,`%${name}%`]
    );

    return result;
  } catch (error) {
    throw error;
  }
};


 export const getAcess = async () => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getFirstAsync(
      "SELECT * FROM settings WHERE first_access = 1"
    );
  
    return result;
  } catch (error) {
    throw error;
  }
};

export const addFirstAccess = async () => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      `INSERT INTO  settings (first_access , standard_message) 
      VALUES  (1, 'Olá [nome do cliente], você possui agendado o serviço [serviço agendado] às [hora do serviço] do dia [data do agendamento] na [empresa]'); `
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteFirstAccess = async () => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      `DELETE FROM settings; `
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getMessage = async () => {
  try {
    createTable();
    const db = await openDatabase();
    const result = await db.getFirstAsync(
      "SELECT * FROM settings WHERE first_access = 1"
    );
  
    return result;
  } catch (error) {
    throw error;
  }
};


export const updateSettings = async (settings) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "UPDATE settings SET standard_message = ? WHERE first_access = 1",
      [
        settings.standard_message
      ]
    );

    return result;
  } catch (error) {
    throw error;
  }
};