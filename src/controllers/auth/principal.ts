import { interfaces } from 'inversify-express-utils';

export class Principal implements interfaces.Principal {
  public details: any;

  public constructor(details: any) {
    this.details = details;
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.details._id) return Promise.resolve(true);
    return Promise.resolve(false);
  }

  public isResourceOwner(resourceId: any): Promise<boolean> {
    return Promise.resolve(resourceId === 1111);
  }

  public isInRole(role: string): Promise<boolean> {
    return Promise.resolve(role === 'admin');
  }
}
