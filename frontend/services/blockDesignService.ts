import api from '@/lib/api';

export interface BlockDesignFabric {
  id: string;
  name: string;
  color: string;
  previewUrl?: string;
}

export interface BlockDesignRegion {
  id: string;
  name: string;
  shape: 'rect' | 'polygon';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  points?: string;
  fabricIndex: number;
  rotation: 0 | 90 | 180 | 270;
}

export interface SavedBlockDesign {
  id: string;
  name: string;
  patternId: string;
  patternName: string;
  globalRotation: number;
  fabrics: BlockDesignFabric[];
  regions: BlockDesignRegion[];
  createdAt: string;
  updatedAt: string;
}

export interface BlockDesignListItem {
  id: string;
  name: string;
  patternId: string;
  patternName: string;
  globalRotation: number;
  fabrics: unknown;
  createdAt: string;
  updatedAt: string;
}

class BlockDesignService {
  async list(): Promise<BlockDesignListItem[]> {
    try {
      const response = await api.get('/api/block-designs');
      return response.data.data.designs || [];
    } catch (error) {
      console.error('Failed to list block designs:', error);
      throw error;
    }
  }

  async getById(designId: string): Promise<SavedBlockDesign> {
    try {
      const response = await api.get(`/api/block-designs/${designId}`);
      return response.data.data.design;
    } catch (error) {
      console.error('Failed to fetch block design:', error);
      throw error;
    }
  }

  async save(data: {
    name: string;
    patternId: string;
    patternName: string;
    globalRotation: number;
    fabrics: BlockDesignFabric[];
    regions: BlockDesignRegion[];
  }): Promise<SavedBlockDesign> {
    try {
      const response = await api.post('/api/block-designs', data);
      return response.data.data.design;
    } catch (error) {
      console.error('Failed to save block design:', error);
      throw error;
    }
  }

  async update(
    designId: string,
    data: {
      name: string;
      patternId: string;
      patternName: string;
      globalRotation: number;
      fabrics: BlockDesignFabric[];
      regions: BlockDesignRegion[];
    }
  ): Promise<SavedBlockDesign> {
    try {
      const response = await api.put(`/api/block-designs/${designId}`, data);
      return response.data.data.design;
    } catch (error) {
      console.error('Failed to update block design:', error);
      throw error;
    }
  }

  async delete(designId: string): Promise<void> {
    try {
      await api.delete(`/api/block-designs/${designId}`);
    } catch (error) {
      console.error('Failed to delete block design:', error);
      throw error;
    }
  }

  async duplicate(designId: string, newName: string): Promise<SavedBlockDesign> {
    try {
      const design = await this.getById(designId);
      return this.save({
        ...design,
        name: newName,
      });
    } catch (error) {
      console.error('Failed to duplicate block design:', error);
      throw error;
    }
  }
}

export default new BlockDesignService();
