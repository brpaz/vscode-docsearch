import DefaultMapper from './default.mapper';
import TerraformMapper from './terraform.mapper';
import MapperFactory from './factory';
import WebDevMapper from './webdev.mapper';
import VercelMapper from './vercel.mapper';
import PrismaMapper from './prisma.mapper';
import NextjsMapper from './nextjs.mapper';

describe('MapperFactory', () => {
  let factory: MapperFactory;

  beforeEach(() => {
    factory = new MapperFactory();
  });

  it('should return a TerraformMapper instance when given docsetId "terraform"', () => {
    const mapper = factory.getMapper('terraform');
    expect(mapper).toBeInstanceOf(TerraformMapper);
  });

  it('should return a TerraformMapper instance when given docsetId "webdev"', () => {
    const mapper = factory.getMapper('webdev');
    expect(mapper).toBeInstanceOf(WebDevMapper);
  });

  it('should return a TerraformMapper instance when given docsetId "vercel"', () => {
    const mapper = factory.getMapper('vercel');
    expect(mapper).toBeInstanceOf(VercelMapper);
  });

  it('should return a TerraformMapper instance when given docsetId "vercel"', () => {
    const mapper = factory.getMapper('prisma');
    expect(mapper).toBeInstanceOf(PrismaMapper);
  });

  it('should return a DefaultMapper instance when given an unknown docsetId', () => {
    const mapper = factory.getMapper('unknown');
    expect(mapper).toBeInstanceOf(DefaultMapper);
  });

  it('should return a NextJS instance when given docset "nextjs"', () => {
    const mapper = factory.getMapper('nextjs');
    expect(mapper).toBeInstanceOf(NextjsMapper);
  });
});
