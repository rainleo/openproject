//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2017 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

import {Injectable} from '@angular/core';
import {ConfigurationDmService} from "core-components/api/api-v3/hal-resource-dms/configuration-dm.service";
import {opServicesModule} from "../../angular-modules";

export const DEFAULT_PAGINATION_OPTIONS = {
  maxVisiblePageOptions: 6,
  optionsTruncationSize: 1
};

export interface IPaginationOptions {
  perPage:number;
  perPageOptions:number[];
  maxVisiblePageOptions:number;
  optionsTruncationSize:number;
}

@Injectable()
export class PaginationService {
  private paginationOptions: IPaginationOptions;

  constructor(private ConfigurationDm:ConfigurationDmService) {
    const gonPaginationOptions = this.getInitialPageOptions();

    this.paginationOptions = {
      perPage: this.getCachedPerPage(gonPaginationOptions),
      perPageOptions: gonPaginationOptions,
      maxVisiblePageOptions: DEFAULT_PAGINATION_OPTIONS.maxVisiblePageOptions,
      optionsTruncationSize: DEFAULT_PAGINATION_OPTIONS.optionsTruncationSize
    };
  }

  public getInitialPageOptions():number[] {
    try {
      return (window as any).gon.settings.pagination.per_page_options;
    } catch(e) {
      console.error("Can't load initial page options from gon: " + e);
      return [];
    }
  }

  public getCachedPerPage(initialPageOptions:number[]):number {
    const value = window.localStorage.getItem('pagination.perPage');
    const perPage = parseInt(value!, 10);

    if (perPage > 0) {
      return perPage;
    }

    if (initialPageOptions.length > 0) {
      return initialPageOptions[0];
    }

    return 20;
  }

  public getPaginationOptions() {
    return this.paginationOptions;
  }

  public getPerPage() {
    return this.paginationOptions.perPage;
  }

  public getMaxVisiblePageOptions() {
    return this.paginationOptions.maxVisiblePageOptions;
  }

  public getOptionsTruncationSize() {
    return this.paginationOptions.optionsTruncationSize;
  }

  public setPerPage(perPage:number) {
    window.localStorage.setItem('pagination.perPage', perPage.toString());
    this.paginationOptions.perPage = perPage;
  }

  public getPerPageOptions() {
    return this.paginationOptions.perPageOptions;
  }

  public setPerPageOptions(perPageOptions:number[]) {
    this.paginationOptions.perPageOptions = perPageOptions;
  }

  public loadPaginationOptions() {
    return this.ConfigurationDm.load().then((configuration:any) => {
      this.setPerPageOptions(configuration.perPageOptions);
      return this.paginationOptions;
    });
  }
}

opServicesModule.service('paginationService', PaginationService);
