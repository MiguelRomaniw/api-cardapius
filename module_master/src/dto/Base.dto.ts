export class BaseDTO {
  private static _genericFrom(instance: any, DTO: any, map: any) {
    const dto = new DTO(instance);

    for (const [key, mapDTO] of Object.entries(map) as [string, any][]) {
      if (!instance[key]) continue;

      dto[key] = mapDTO.from(instance[key]);
    }

    return dto;
  }

  public static _from(instancesOrInstance: any | any[], DTO: any, map: any) {
    try {
      if (!Array.isArray(instancesOrInstance)) return this._genericFrom(instancesOrInstance, DTO, map);

      const mappped: any = instancesOrInstance.map((i: any) => this._from(i, DTO, map));

      return mappped;
    } catch (error) {
      console.log(error);
    }
  }
}
