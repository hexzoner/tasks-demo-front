import { Flex, TextField, Section, Button } from "@radix-ui/themes"
import { sLoginSection, sLoginPage, sButtonSubmit, sFormContainer } from "../styles/styles"

export default function Register() {
    return <div style={sLoginPage}>
        <Section style={sLoginSection}>
            <p style={{ textAlign: "center", fontSize: "1.5rem" }}>Create New Account</p>
            <Flex direction="column" gap="3" style={sFormContainer}>
                <TextField.Root color="gray" variant="soft" placeholder="Email Address" />
                <TextField.Root color="gray" variant="soft" placeholder="Password" />
                <TextField.Root color="gray" variant="soft" placeholder="Repeat password" />
                <Button color="green" variant="soft" style={sButtonSubmit}>Submit</Button>
            </Flex>
        </Section>
    </div >
}