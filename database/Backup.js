import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

// Função para abrir o banco de dados
const openDatabase = async () => {
    console.log(`abrindo o banco`)
    try {
        const db = await SQLite.openDatabaseAsync("schedules.db");
        return db;
    } catch (error) {
        throw error;
    }
}; 

const getTableStructure = async (db) => {
    console.log("Pegando as tabelas");

    try {
        // Pegando os nomes das tabelas
        const tablesResult = await db.runAsync('SELECT name FROM sqlite_master WHERE type="table";');

        let createQueries = '';

        // Verifica se rows é um objeto com as linhas
        if (tablesResult.rows && tablesResult.rows.length) {
            // Usando for tradicional para iterar pelas tabelas
            for (let i = 0; i < tablesResult.rows.length; i++) {
                const row = tablesResult.rows.item(i); // Acessa a linha pelo índice
                const tableName = row.name;

                // Chama uma função assíncrona para pegar a estrutura de cada tabela
                await db.runAsync(`SELECT sql FROM sqlite_master WHERE name='${tableName}';`)
                    .then((tableStructureResult) => {
                        createQueries += tableStructureResult.rows.item(0).sql + ';\n\n';
                        console.log(`Estrutura da tabela ${tableName} obtida com sucesso`);
                    })
                    .catch((err) => {
                        console.error(`Erro ao pegar a estrutura da tabela ${tableName}: ${err.message}`);
                    });
            }
        }

        // Retorna as queries de criação de tabelas
        return createQueries;
    } catch (err) {
        console.error(`Erro ao pegar as tabelas: ${err.message}`);
        throw new Error(err);
    }
};


// Função para obter dados de uma tabela
const getTableData = (tableName, db) => {
    return new Promise((resolve, reject) => {
        db.runAsync(`SELECT * FROM ${tableName}`, [], (_, result) => {
            let insertQueries = '';

            // Usando forEach para iterar sobre as linhas
            result.rows._array.forEach((row) => {
                const columns = Object.keys(row).join(', ');
                const values = Object.values(row)
                    .map((val) =>
                        typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : val
                    )
                    .join(', ');
                const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`;
                insertQueries += insertQuery;
            });

            resolve(insertQueries);
        });
    });
};


// Função para criar o backup
const createBackup = async () => {
    try {
        console.log('comeco da funcao do backup');
        const db = await openDatabase();

        console.log('sguaaaa');
        // Caminho para salvar o arquivo de backup no cacheDirectory
        const backupFilePath = FileSystem.cacheDirectory + 'backup.sql';

        console.log('sguaaaa123');
        console.log(FileSystem.cacheDirectory);
        // Obter a estrutura das tabelas

        console.log('nem sei mais');
        const tableStructure = await getTableStructure(db);

        console.log('xxxxx');
        // Escrever a estrutura no arquivo de backup
        await FileSystem.writeAsStringAsync(backupFilePath, tableStructure);

        // Obter os nomes das tabelas
        console.log('teste');

        try {
            // Usando db.allAsync() para executar a consulta e obter os resultados
            const result = await db.getAllAsync('SELECT name FROM sqlite_master WHERE type="table";');
            
            const tableNames = result.map(row => row.name);
            console.log(tableNames);  // Exibe os nomes das tabelas
            
        } catch (error) {
            console.error('Erro ao obter as tabelas:', error.message);
        }

        console.log(`aaaaa n sei mais`);

        // Escrever os dados de cada tabela no arquivo de backup
        for (const table of tableStructure) {
            const tableData = await getTableData(table, db);
            await FileSystem.writeAsStringAsync(backupFilePath, tableData, {
                encoding: FileSystem.EncodingType.UTF8,
                append: true,
            });
        }

        console.log(`abaixo do for table of`);
        // Alerta de sucesso
        Alert.alert('Backup criado com sucesso!', `Arquivo salvo em: ${backupFilePath}`);
        console.log(backupFilePath);
    } catch (error) {
        console.error('Erro ao criar backup:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao criar o backup.');
    }
};

export default createBackup;
