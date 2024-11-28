import * as entities from "Shared/database/entities";
import * as dtos from "Shared/dto";
import { dataSource } from "Shared/database/app-data-source";

export class AppContext {
  protected static readonly additionalRepository = dataSource.getRepository(entities.Additional);
  protected static readonly additionalGroupRepository = dataSource.getRepository(entities.AdditionalGroup);
  protected static readonly categoryRepository = dataSource.getRepository(entities.Category);
  protected static readonly companyRepository = dataSource.getRepository(entities.Company);
  protected static readonly companyLogoRepository = dataSource.getRepository(entities.CompanyLogo);
  protected static readonly customerRepository = dataSource.getRepository(entities.Customer);
  protected static readonly fileRepository = dataSource.getRepository(entities.File);
  protected static readonly managerRepository = dataSource.getRepository(entities.Manager);
  protected static readonly masterRepository = dataSource.getRepository(entities.Master);
  protected static readonly menuRepository = dataSource.getRepository(entities.Menu);
  protected static readonly orderRepository = dataSource.getRepository(entities.Order);
  protected static readonly otpKeyRepository = dataSource.getRepository(entities.OtpKey);
  protected static readonly productRepository = dataSource.getRepository(entities.Product);
  protected static readonly productGroupRepository = dataSource.getRepository(entities.ProductGroup);
  protected static readonly productImageRepository = dataSource.getRepository(entities.ProductImage);

  protected static readonly AdditionalDTO = dtos.AdditionalDTO;
  protected static readonly AdditionalGroupDTO = dtos.AdditionalGroupDTO;
  protected static readonly CategoryDTO = dtos.CategoryDTO;
  protected static readonly CompanyDTO = dtos.CompanyDTO;
  protected static readonly CompanyLogoDTO = dtos.CompanyLogoDTO;
  protected static readonly CustomerDTO = dtos.CustomerDTO;
  protected static readonly FileDTO = dtos.FileDTO;
  protected static readonly ManagerDTO = dtos.ManagerDTO;
  protected static readonly MenuDTO = dtos.MenuDTO;
  protected static readonly OrderDTO = dtos.OrderDTO;
  protected static readonly ProductDTO = dtos.ProductDTO;
  protected static readonly ProductGroupDTO = dtos.ProductGroupDTO;
  protected static readonly ProductImageDto = dtos.ProductImageDTO;
}
