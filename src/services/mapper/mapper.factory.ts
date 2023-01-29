import { ResultMapper } from './mapper';
import { DefaultMapper } from './default.mapper';
import { TerraformMapper } from './terraform.mapper';
import { VercelMapper } from './vercel.mapper';
import { PrismaMapper } from './prisma.mapper';
import { WebDevMapper } from './webdev.mapper';
export class MapperFactory {
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
      default:
        return new DefaultMapper();
    }
  }
}
