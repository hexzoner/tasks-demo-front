import { Flex, TextField, Section, Button } from "@radix-ui/themes"
import { sLoginSection, sLoginPage, sButtonSubmit } from "../styles/styles"

export default function Login() {
    return <div style={sLoginPage}>
        <Section style={sLoginSection}>
            <p style={{ textAlign: "center", fontSize: "1.5rem" }}>Login</p>
            <Flex direction="column" gap="3" maxWidth="250px" style={{ margin: "auto" }}>
                <TextField.Root color="gray" variant="soft" placeholder="Email Address" />
                <TextField.Root color="gray" variant="soft" placeholder="Password" />
                <Button color="green" variant="soft" style={sButtonSubmit}>Submit</Button>
            </Flex>
        </Section>
    </div >
}