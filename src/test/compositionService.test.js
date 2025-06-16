jest.mock('../db/dbPg.js', () => ({
    query: jest.fn()
}));

const { query } = require('../db/dbPg.js');
const { CompositionService } = require('../service/compositionService.js')
const {BadRequestError} = require('../errors/httpError.js');

describe('CompositionService - createCompartmentForProduct', () => {
    let compositionService = new CompositionService();

    it('Successful create Compartment', async () => {
        const productData = {
            supplier_country: 'Test',
            compartment_name: 'TestCompartment',
            current_space_compartment: 0,
            max_space_compartment: 100,
            date_of_arrival: '01.01.1111'
        };

        query.mockResolvedValueOnce({
            rows: [{
                id: 1,
                compartment_name: productData.compartment_name,
                current_space_compartment: productData.current_space_compartment,
                max_space_compartment: productData.max_space_compartment,
                date_of_arrival: productData.date_of_arrival
            }]
        });

        query.mockResolvedValueOnce({
            rows: [{
                supplier_country: productData.supplier_country,
                compartment_id: 1
            }]
        });

        const result = await compositionService.createCompartmentForProduct(productData);

        expect(query).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
            message: "Add compartment on composition",
            composition: {
                supplier_country: 'Test',
                compartment_id: 1,
            }
        });
    });

    it('There are no changes', async () => {
        await expect(compositionService.createCompartmentForProduct({})).resolves.toBe("You have not filled in all the columns!");
    });
});

describe('CompositionService - createProduct', () => {
    let compositionService = new CompositionService();

    it('Added product successful', async () => {
        query.mockClear();
        const productData = {
            serial_number: 123456,
            product_name: "TestProduct",
            price_pet_unit: 0,
            unit_weight: 0,
            total_cost: 0,
            total_number: 0,
        }

        query.mockResolvedValueOnce({rows: [productData]});

        const result = await compositionService.createProduct(productData);
        expect(query).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            message: "Product created successfuly!",
            product: productData,
        })
    })

    it("There are no changes", async () => {
        await expect(compositionService.createProduct()).rejects.toThrow("You have not filled in all the columns!");
    })


})


describe('CompositionService - deleteCompartment', () => {
    let compositionService = new CompositionService();

    it('Delete compartment successful', async () => {
        query.mockClear();
        const compartment_name = "TestCompartment";


        const mockCompartment = {
            id: 1,
            supplier_country: 'Test',
            compartment_name: 'TestCompartment',
            current_space_compartment: 0,
            max_space_compartment: 100,
            date_of_arrival: '01.01.1111'
        }
        
        query.mockResolvedValueOnce({rows: [mockCompartment]});

        query.mockResolvedValueOnce({rows: []});

        const result = await compositionService.deleteCompartment(compartment_name);

        expect(query).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
            message: "Compartent delete successfuly!",
        });

    })

    it("Compartment not found", async () => {
        query.mockClear();
        const compartment_name = 'TestCompartment';

        query.mockResolvedValueOnce({rows: []});

        await expect(compositionService.deleteCompartment(compartment_name))
        .rejects
        .toThrow("Compartment not found");
        expect(query).toHaveBeenCalledTimes(1);
    })
})


describe('CompositionService - deleteProduct', () => {
    let compositionService = new CompositionService();

    it("Delete product successfuly", async () => {
        query.mockClear();
        const serial_number = {
            serial_Number: 123456,
        }

        const mockProduct = {
            compartment_id: 1,
            product_name: 'Test',
            serial_number: 123456,
            price_pet_unit: 0,
            unit_weight: 0,
            total_cost: 0,
            total_number: 0,
        }

        query.mockResolvedValueOnce({rows: [mockProduct]});

        query.mockResolvedValueOnce({rows: [mockProduct]});

        const result = await compositionService.deleteProduct(serial_number);

        expect(query).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
            message: "Product delete successfuly!",
        });
    })

    it("Product not found", async () => {
        query.mockClear();
        const serial_number = {
            serial_Number: null,
        }

        query.mockResolvedValueOnce({rows: []});
        
        await expect(compositionService.deleteProduct(serial_number)).rejects.toThrow("Product not found")
        expect(query).toHaveBeenCalledTimes(1);
    })
})

describe("CompositionService - addProductFromCompartment", () => {
    let compositionService = new CompositionService();

    it('Successful added product from compartment', async () => {
        query.mockClear()
        const productData = { 
            serial_number: 123456,
            compartment_name: 'TestCompartment',
        }

        const mockCompartment = {
            id: 1,
            supplier_country: 'Test',
            compartment_name: 'TestCompartment',
            current_space_compartment: 0,
            max_space_compartment: 100,
            date_of_arrival: '01.01.1111'
    }

        const mockProduct = {
            compartment_id: 1,
            product_name: 'Test',
            serial_number: 123456,
            price_pet_unit: 0,
            unit_weight: 0,
            total_cost: 0,
            total_number: 0,
        }
        query.mockResolvedValueOnce({ rows: [mockCompartment] });
        query.mockResolvedValueOnce({ rows: [mockProduct] });
        query.mockResolvedValueOnce({ rows: [] });
        query.mockResolvedValueOnce({ rows: [mockCompartment] });

        console.log(query.mock.calls);
        
        const result = await compositionService.addProductFromCompartment(productData);

        expect(query).toHaveBeenCalledTimes(4);
        expect(result).toEqual({
            message: "Product add from compartment successfuly!",
            compartment: mockCompartment,
        })

    })
    it("Compartment not found", async () => {
        query.mockClear();
        const productData = {}

        query.mockResolvedValueOnce({rows: []});

        try {
            await compositionService.addProductFromCompartment(productData);
        } catch (err) {
            expect(query).toHaveBeenCalledTimes(2);
            expect(err.message).toBe('Product not found');
    }
    })

    it('Product not found', async () => {
        query.mockClear();
        const productData = {
            serial_number: null,
            compartment_name: 'TestCompartment',
        };

        const mockCompartment = {
            id: 1,
            supplier_country: 'Test',
            compartment_name: 'TestCompartment',
            current_space_compartment: 0,
            max_space_compartment: 100,
            date_of_arrival: '01.01.1111'
        }
        const mockProduct = {}
        // 1 Find Compartment 
        query.mockResolvedValueOnce({rows: [mockCompartment]});

        // 2 Find Product
        query.mockResolvedValueOnce({rows: [mockProduct]});

        try{
            const result = await compositionService.addProductFromCompartment(productData)
        }catch(err) {
            expect(query).toHaveBeenCalledTimes(2);
            expect(err).toBe("Product not found")
        }
        
    })

    it("Current space > max space", async () => {
        query.mockClear();
        const productData = { 
            serial_number: 123456,
            compartment_name: 'TestCompartment',
        }

        const mockCompartment = {
            id: 1,
            supplier_country: 'Test',
            compartment_name: 'TestCompartment',
            current_space_compartment: 0,
            max_space_compartment: 100,
            date_of_arrival: '01.01.1111'
        }

        const mockProduct = {
            compartment_id: 1,
            product_name: 'Test',
            serial_number: 123456,
            price_pet_unit: 0,
            unit_weight: 0,
            total_cost: 0,
            total_number: 0,
        }

        query.mockResolvedValueOnce({rows: [mockCompartment]});
        query.mockResolvedValueOnce({rows: [mockProduct]})

        try{
            
        const result = await compositionService.addProductFromCompartment(productData);
        }catch(err){
            expect(err).toBe("There is not enough city");
            expect(query).toHaveBeenCalledTimes(2);
        }
        
    })
})

describe("CompositionService - updateProduct", () => {
    let compositionService = new CompositionService();

    it("Update product", async () => {
        query.mockClear();
        const serial_number = 123456;
        const mockUpdateProduct = {
            compartment_id: 1,
            product_name: 'Test',
            serial_number: 123456,
            price_pet_unit: 0,
            unit_weight: 1,
            total_cost: 1,
            total_number: 0,
        }

        query.mockResolvedValueOnce({rows: [mockUpdateProduct]});

        const result = await compositionService.updateProduct(mockUpdateProduct);

        expect(query).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            message: "Product updated successfuly!",
        })
    })

    it("Enter at least one field for changes", async () => {
        query.mockClear();
        const mockUpdateData = {
            serial_number: 123456,
        }
        await  expect(compositionService.updateProduct(mockUpdateData)).rejects.toThrow("Enter at least one field for changes")
        expect(query).toHaveBeenCalledTimes(0);
    })
})

describe("CompositionService - updateCompartment", () => {
    let compositionService = new CompositionService();

    it("Update compartment successfuly!", async () => {
        query.mockClear();
        const compartment_name = 'TestCompartment';
        const mockUpdateCompartment = {
            id: 1,
            supplier_country: 'Test',
            compartment_name: 'TestCompartment',
            current_space_compartment: 0,
            max_space_compartment: 100,
            date_of_arrival: '01.01.1111'
        }

        query.mockResolvedValueOnce({rows: [mockUpdateCompartment]});

        const result = await compositionService.updateCompartment(mockUpdateCompartment);

        expect(query).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            message: "Compartment updated successfuly!",
        })
    })
     it("Enter at least one field for changes", async () => {
            query.mockClear();

            const updateData = {
                compartment_name: "TestCompartment"
            };

            await expect(compositionService.updateCompartment(updateData)).rejects.toThrow("Enter at least one field for changes");
            expect(query).toHaveBeenCalledTimes(0);
        })
})

describe("getProductFromCompartment", () => {
    let compositionService = new CompositionService();

    it("Get product", async () => {
        query.mockClear();
        const mockProducts = {
            firstProduct: {
                compartment_id: 1,
                product_name: 'Test',
                serial_number: 123456,
                price_pet_unit: 0,
                unit_weight: 1,
                total_cost: 1,
                total_number: 0,
            },
            secondProduct: {
                compartment_id: 2,
                product_name: 'Test2',
                serial_number: 999999,
                price_pet_unit: 1,
                unit_weight: 2,
                total_cost: 2,
                total_number: 2,
            }
        }
        query.mockResolvedValueOnce({rows: [mockProducts]});

        const result = await compositionService.getProductFromCompartment(mockProducts);
        expect(query).toHaveBeenCalledTimes(1);
        expect(result).toEqual([mockProducts]);
    })
})

describe("GetCompartmentFromComposition", () => {
    let compositionService = new CompositionService();

    it("Get compartment", async () => {
        query.mockClear();
        const mockCompartments = {
            firstCompartment: {
                id: 1,
                supplier_country: 'Test',
                ompartment_name: 'TestCompartment',
                current_space_compartment: 0,
                max_space_compartment: 100,
                date_of_arrival: '01.01.1111'
            },
            secondCompartment: {
                id: 2,
                supplier_country: 'Test2',
                ompartment_name: 'TestCompartment2',
                current_space_compartment: 50,
                max_space_compartment: 200,
                date_of_arrival: '02.02.2222',
            }
        }

        query.mockResolvedValueOnce({rows: [mockCompartments]});

        const result = await compositionService.getCompartmentFromComposition(mockCompartments);

        expect(query).toHaveBeenCalledTimes(1);
        expect(result).toEqual([mockCompartments]);
    })
})