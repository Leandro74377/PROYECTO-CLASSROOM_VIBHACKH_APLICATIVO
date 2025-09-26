import { Router, Request, Response } from 'express';
import { getSeed, generateData, getOverview } from '../services/generator';

const router = Router();

function envelope(data: any, seed: number) {
	return {
		data,
		meta: {
			seed,
			generated_at: new Date().toISOString(),
		},
	};
}

router.get('/', (req: Request, res: Response) => {
	const seed = getSeed();
	const data = generateData(seed);
	const overview = getOverview(data);
	res.json(envelope(overview, seed));
});

export default router;
