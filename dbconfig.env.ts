const config = {
    development: {
        ormtype: {
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "",
            database: "loginsystem",
            //authSource: "admin",
            synchronize: true,
            entities: ["dist/**/**.entity{.ts,.js}"]
        },
    },
    Production: {
        ormtype: { 
            type: "mysql",
            host: "github.com",
            port: 3306,
            username: "rajengithub",
            password: "sdfjah112423",
            database: "todo",
            //authSource: "admin",
            synchronize: false,  
            entities: ["dist/src/**/**.entity{.ts,.js}"]    //<-- change src directory to dist
        },
    },
};

const envConfig = config[process.env.NODE_ENV || "development"];

export default envConfig;