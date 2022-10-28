import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import HelloWorld from "../HelloWorld.vue";

describe("HelloWorld", () => {
  it("renders properly", () => {
    const wrapper = mount(HelloWorld,{
      propsData: {
        Department: '',
        RoleName:'hjjh',
        skills_required:'00007',
        // error: 'Invalid Role Name'
      }
    
    })
    // const byId = wrapper.find('#submitBTN')
    // //CLICK id submitBTN
    // expect(byId.element.id).toBe('submitBTN')    
    //can call for data(parameter)
    wrapper.vm.getErrorMessage()
    expect(wrapper.vm.errorm).toBe('Invalid Role Name');
  
  });
});
