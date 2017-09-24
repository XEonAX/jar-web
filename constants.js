var env = process.env;
/**
 * Constants Module
 */
module.exports = {
    /**
     * Extension to be used HandleBars Templating Engine
     * @return {string}
     */
    HandlebarsExtn: '.hbs',
    
    /**
     * Connection String for Mongoose. Uses environment variable `MONGODB_DB_URL` if defined
     * @return {string}
     */
    ConnectionString : env.MONGODB_DB_URL || 'mongodb://localhost/passport',

    
    /**
     * Port to listen on.  Uses environment variable `PORT` if defined
     * @return {number}
     */
    Port: env.PORT || 3000,

    /**
     * Session Secret for Express Sessions.
     * @return {string}
     */  
    SessionSecret: 'jE9V0GbxEfGp0eax wc6E1xV5APwdAzt5 GqB63n8Bx8TwfLRr wAeQPVyAKWXLIqnM',
    
    /**
     * Primary Color from Material Palette.
     * @return {string}
     */  
    PrimaryColor: 'indigo',
    
    /**
     * Secondary Color from Material Palette.
     * @return {string}
     */   
    SecondaryColor: 'pink'
};