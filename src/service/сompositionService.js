const { query } = require("../db/dbPg.js");
const { BadRequestError, ConflictError, NotFoundError } = require("../errors/httpError.js");


class CompositionService{


    async createCompartmentForProduct(productData){
        try{
            const length = Object.keys(productData).length;
            if(length < 5){
                throw new BadRequestError("You have not filled in all the columns!");
            }

            const {compartment_name, current_space_compartment, max_space_compartment, date_of_arrival} = productData;
            const {supplier_country} = productData;
            
            const compartment = await query("INSERT INTO compartment (compartment_name, current_space_compartment, max_space_compartment, date_of_arrival) VALUES ($1, $2, $3, $4) RETURNING *", [compartment_name, current_space_compartment, max_space_compartment, date_of_arrival])
            const composition = await query('INSERT INTO composition (supplier_country, compartment_id) VALUES ($1, $2) RETURNING *', [supplier_country, compartment.rows[0].id]);

            return {message: "Add compartment on composition", composition: composition.rows[0]};
        }catch(err){
            console.error("Error", err);
            return err.message
            
        }
    }

    async addProductFromCompartment(productData) {
        try{
            const {serial_number, compartment_name} = productData;
            const existCompartment = await query("SELECT * FROM compartment WHERE compartment_name = $1", [compartment_name]);
            if(!existCompartment.rows[0]){
                throw new NotFoundError("Compartment not found");
            }
                    
            console.log(productData);
            

            const existProduct = await query("SELECT * FROM product WHERE serial_number = $1", [serial_number]);
            
            if(!existProduct.rows[0]){
                throw new NotFoundError("Product not found");
            }
            
            
            const space_compartment = existCompartment.rows[0].current_space_compartment
            const max_space_compartment = existCompartment.rows[0].max_space_compartment;
            const unit_weight = existProduct.rows[0].unit_weight;

            if(unit_weight + space_compartment > max_space_compartment) {
                throw new ConflictError("There is not enough city")
            }
            
            const newSpace = unit_weight + space_compartment;
            const updateProduct = await query("UPDATE product SET compartment_id = $1 WHERE serial_number = $2", [existCompartment.rows[0].id, existProduct.rows[0].serial_number]);
            const updateCompartment = await query("UPDATE compartment SET current_space_compartment = $1 WHERE id = $2", [newSpace, existCompartment.rows[0].id]);

            return {message: "Product add from compartment successfuly!", compartment: updateCompartment.rows[0]};
            
        }catch(err){
            console.log(err.message);
            throw Error(err.message);
        }
    }

    async createProduct(productData){
        try{
            const length = Object.keys(productData).length
            if(length.length < 6) {
                throw new BadRequestError("You have not filled in all the columns!");
            }

            const { product_name, price_pet_unit, unit_weight, total_cost, total_number } = productData;
            
            const serial_number = Math.floor(100000 + Math.random() * 900000)
            
            
            const newProduct = await query("INSERT INTO product (product_name, price_pet_unit, unit_weight, total_cost, serial_number, total_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [product_name, price_pet_unit, unit_weight, total_cost, serial_number, total_number]);
            return {message: "Product created successfuly!", product: newProduct.rows[0]};
        }catch(err){
            console.log(err.message);
            return err.message;
            
        }
    }

    async deleteProduct(serial_number){

        const { ...serial_Number } = serial_number;
        console.log('This serial_number FROM service:', serial_Number.serial_number);
        
        const existProduct = await query("SELECT * FROM product WHERE serial_number = $1", [serial_Number.serial_number]);
        if(!existProduct.rows[0]){
            throw new NotFoundError("Product not found")
        }

        await query("DELETE FROM product WHERE serial_number = $1", [serial_Number.serial_number]);

        return {message: "Product delete succesfuly!"};
    }

    async deleteCompartment(compartment_name) {
        const existCompartment = await query("SELECT * FROM compartment WHERE compartment_name = $1", [compartment_name]);

        if(!existCompartment.rows[0]){
            throw new NotFoundError("Compartment not found");
        }

        await query("DELETE FROM compartment WHERE id = $1", [existCompartment.rows[0].id]);
    }

    async updateProduct(updateData,) {
        const { serial_number, ...fieldsToUpdate} = updateData;

        const keys = Object.keys(fieldsToUpdate).filter((key) => key !== undefined);

        if(keys.length == 0) {
            throw new BadRequestError("Enter at least one field for changes");
        }

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

        const values = keys.map(key => updateData[key]);
        
        values.push(serial_number);
        console.log(`UPDATE product SET ${setClause} WHERE serial_number = $${values.length}`);
        
        console.log([...values, serial_number]);
        
        await query(`UPDATE product SET ${setClause} WHERE serial_number = $${values.length}`, [...values]);
    }

    async getProductFromComposition() {
        const products = await query('SELECT * FROM composition');
        return products.rows[0];
    }

    async updateCompartment(updateData) {
        const {compartment_name, ... fieldsToUpdate} = updateData;

        const keys = Object.keys(fieldsToUpdate).filter((key) => key !== undefined);

        if(keys.length == 0){
            throw new BadRequestError("Enter at least one field for changes");
        };

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = keys.map((key) => updateData[key]);

        values.push(compartment_name);

        await query(`UPDATE compartment SET ${setClause} WHERE compartment_name = $${values.length}`, [...values]);
    }

    async getProductFromCompartment() {
        const products = await query('SELECT * FROM compartment');
        
        return products.rows[0];
    }
}

module.exports = { CompositionService };