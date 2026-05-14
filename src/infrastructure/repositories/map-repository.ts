import type { MapMarker } from "@/src/domain/entities/map";
import type {
    GetMapMarkersParams,
    IMapRepository,
} from "@/src/domain/repositories/map-repository";
import type {
    OrganizationMapMarkerDto,
    RescueMapMarkerDto,
} from "@/src/infrastructure/api/generated/model";
import {
    getMapMarkers,
    getMapMarkers1,
} from "@/src/infrastructure/api/generated/pet-rescue-api";

export class ApiMapRepository implements IMapRepository {
  async getMarkers(params: GetMapMarkersParams): Promise<MapMarker[]> {
    const queryParams = {
      ...(params.bounds
        ? {
            minLat: params.bounds.minLat,
            minLng: params.bounds.minLng,
            maxLat: params.bounds.maxLat,
            maxLng: params.bounds.maxLng,
          }
        : {}),
      ...(params.source === "organization" && params.organizationTypes?.length
        ? { type: params.organizationTypes }
        : {}),
    };

    const response =
      params.source === "rescue"
        ? await getMapMarkers(
            Object.keys(queryParams).length > 0 ? queryParams : undefined,
          )
        : await getMapMarkers1(queryParams);

    // normalize response shape: generated client may return array or wrapper
    const raw: any = response;
    let itemsRaw: any[] = [];
    if (Array.isArray(raw)) {
      itemsRaw = raw;
    } else if (raw && Array.isArray(raw.data)) {
      itemsRaw = raw.data;
    } else if (raw && raw.data && Array.isArray(raw.data.data)) {
      itemsRaw = raw.data.data;
    }

    // debug log: response shape and params (helps trace MinLat/MinLng issues)
    try {
      console.debug("ApiMapRepository.getMarkers response", {
        source: params.source,
        queryParams,
        size: itemsRaw.length,
        raw,
      });
    } catch {}

    const items = itemsRaw as (RescueMapMarkerDto | OrganizationMapMarkerDto)[];
    return items.map((item) => mapMarker(params.source, item));
  }
}

const mapMarker = (
  source: GetMapMarkersParams["source"],
  item: RescueMapMarkerDto | OrganizationMapMarkerDto,
): MapMarker => {
  if (source === "rescue") {
    const rescue = item as RescueMapMarkerDto;
    return {
      id:
        rescue.caseId ??
        rescue.caseCode ??
        `${rescue.latitude}-${rescue.longitude}`,
      source,
      title: rescue.caseCode ?? rescue.species ?? "Ca cứu hộ",
      description: rescue.species ?? "Ca cứu hộ",
      latitude: rescue.latitude ?? 0,
      longitude: rescue.longitude ?? 0,
      subtitle: rescue.status ? `Trạng thái: ${rescue.status}` : undefined,
      tag: rescue.priority?.toString(),
      status: rescue.status?.toString(),
      priority: rescue.priority?.toString(),
      extra: rescue.reportedAt,
    };
  }

  const organization = item as OrganizationMapMarkerDto;
  return {
    id:
      organization.organizationId ??
      organization.organizationCode ??
      `${organization.latitude}-${organization.longitude}`,
    source,
    title: organization.name ?? "Tổ chức",
    description: organization.type ?? "loại tổ chức",
    latitude: organization.latitude ?? 0,
    longitude: organization.longitude ?? 0,
    subtitle: organization.status,
    tag: organization.wardName,
    extra: organization.provinceName,
  };
};
