import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();

const getData = async () => {
    const data = await fs.readFile('car-list.json');
    return JSON.parse(data);
}

const returnFnOrder = (res, response) => {
    if (response.length == 1) {
        res.send([response[0].brand]);
    } else {
        res.send(response.map((brand) => brand.brand));
    }
}

router.get('/marcas/maisModelos', async (req, res) => {
    const brands = await getData();

    let max = 0;
    let response = [];

    brands.filter((brand) => {
        if (brand.models.length >= max) {
            max = brand.models.length;
            response = [];
            response.push(brand);
        } else if (brand.models.length === max) {
            response.push(brand);
        }
    });

    returnFnOrder(res, response);
});

router.get('/marcas/menosModelos', async (req, res) => {
    const brands = await getData();

    let min = brands[0].models.length;
    let response = [];

    brands.filter((brand) => {
        if (brand.models.length <= min) {
            min = brand.models.length;
            response = [];
            response.push(brand);
        } else if (brand.models.length === min) {
            response.push(brand);
        }
    });

    returnFnOrder(res, response);
});

router.get('/marcas/listaMaisModelos/:id', async (req, res) => {
    const brands = await getData();

    let response = [];

    req.params.id = parseInt(req.params.id);

    brands.sort((brandA, brandB) => {
        if (brandA.models.length < brandB.models.length)
            return 1;
        if (brandA.models.length > brandB.models.length)
            return -1;
        return 0;
    });

    brands.sort((brandA, brandB) => {
        if (brandA.models.length == brandB.models.length)
            return -1;
        if (brandA.models.length > brandB.models.length)
            return -1;
        if (brandA.models.length < brandB.models.length)
            return 1;
        return 0;
    });

    response = brands.slice(0, req.params.id);

    res.send(response.map((brand) => `${brand.brand} - ${brand.models.length}`));
});

router.get('/marcas/listaMenosModelos/:id', async (req, res) => {
    const brands = await getData();

    let response = [];

    req.params.id = parseInt(req.params.id);

    brands.sort((brandA, brandB) => {
        if (brandA.models.length > brandB.models.length)
            return 1;
        if (brandA.models.length < brandB.models.length)
            return -1;
        return 0;
    });

    brands.sort((brandA, brandB) => {
        if (brandA.models.length == brandB.models.length)
            return 1;
        if (brandA.models.length > brandB.models.length)
            return 1;
        if (brandA.models.length < brandB.models.length)
            return -1;
        return 0;
    });

    response = brands.slice(0, req.params.id);

    res.send(response.map((brand) => `${brand.brand} - ${brand.models.length}`));
});

router.post('/marcas/listaModelos', async (req, res) => {
    const brands = await getData();
    const response = [];
    const nomeMarca = req.body.nomeMarca.toLowerCase();
    brands.map((brandObj) => {
        const name = brandObj.brand.toLowerCase();
        if (name.indexOf(nomeMarca) != -1) {
            response.push(brandObj);
        }
    });
    res.send(response);
});

export default router;