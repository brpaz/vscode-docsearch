import { ResultMapper } from './mapper';
import DefaultMapper from './default.mapper';
import TerraformMapper from './terraform.mapper';
import VercelMapper from './vercel.mapper';
import PrismaMapper from './prisma.mapper';
import WebDevMapper from './webdev.mapper';
import NextjsMapper from './nextjs.mapper';

export default class MapperFactory {
  public getMapper(docsetId: string): ResultMapper {
    switch (docsetId) {
      case 'terraform':
        return new TerraformMapper();
      case 'webdev':
        return new WebDevMapper();
      case 'prisma':
        return new PrismaMapper();
      case 'vercel':
        return new VercelMapper();
      case 'nextjs':
        return new NextjsMapper();
      default:
        return new DefaultMapper();
    }
  }
}
