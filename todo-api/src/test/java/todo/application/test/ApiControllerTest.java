package todo.application.test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.isA;
import static org.junit.Assert.*;
import static org.mockito.Matchers.isNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import com.google.gson.Gson;

import todo.model.TodoItem;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ApiControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@Test
	public void checkIfRequestReturnsTodoLists() throws Exception {
		this.mockMvc.perform(get("/"))
		.andExpect(status().isOk())
		.andExpect(content().contentType("application/json;charset=UTF-8"))
		.andExpect(jsonPath("$[0].name", is("First to-do list")))
		.andExpect(jsonPath("$[0].items", isA(List.class)));
		
	}

	@Test
	public void checkIfItemCanBeAdded() throws Exception {
		String json = "{\r\n" + 
				"	\"listIndex\": \"0\",\r\n" + 
				"	\"item\": {\r\n" + 
				"		\"name\": \"four\",\r\n" + 
				"		\"description\": \"yup, thats me\",\r\n" + 
				"		\"deadline\": \"1/12/2018\"\r\n" + 
				"	}\r\n" + 
				"}";
		this.mockMvc.perform(post("/addItem")
				.contentType(MediaType.APPLICATION_JSON)
				.content(json))
		.andExpect(status().isOk())
		.andExpect(jsonPath("$[0].items[0].name", is("four")))
		.andExpect(jsonPath("$[0].items[0].description", is("yup, thats me")))
		.andExpect(jsonPath("$[0].items[0].deadline", is("1/12/2018")));
	}
	
	@Test
	public void checkIfListCanBeAdded() throws Exception {
		String json = "{\r\n" + 
				"	\"name\": \"this is a new thing\"\r\n" + 
				"}";
		this.mockMvc.perform(post("/newList")
				.contentType(MediaType.APPLICATION_JSON)
				.content(json))
		.andExpect(status().isOk())
		.andExpect(jsonPath("$[1].name", is("this is a new thing")));
	}
}
